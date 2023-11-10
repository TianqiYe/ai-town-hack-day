import { chatCompletion, CreateChatCompletionRequest } from './openai.js';

const msToSeconds = (ms: number) => ms / 1000;
type chatCompletionWithLoggingRequest = Omit<CreateChatCompletionRequest, 'model'>;

type LLMModel = 'gpt-4-0613' | 'gpt-4' | 'gpt-4-32k' | 'gpt-4-32k-0613' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0613' | 'gpt-3.5-turbo-16k' | 'gpt-3.5-turbo-16k-0613' | undefined;

// this function wraps the chat completion function and logs the call to the LLM service
export const chatCompletionWithLogging = async (params: chatCompletionWithLoggingRequest) => {
  const {stop, ...chatCompletionRequest} = params; 
  //const chatCompletionRequest = params as Omit<CreateChatCompletionRequest, 'model'>;
  const model: LLMModel = process.env.LLM_MODEL_ID as LLMModel;
  const response = await chatCompletion({...chatCompletionRequest, model, stream: false, stop: []}); // set stream to false
  // remove stop words if it starts with them
  let responseContent = response.content;
  let logged_response_content = response.content;
  let functionCallName = undefined;
  if (response.content !== null){
    // only trim when the content is not null
    if (typeof stop === 'string') {
      if (responseContent.startsWith(stop)) {
        responseContent = responseContent.replace(stop, '');
      }
    } else if (Array.isArray(stop)) {
      stop.forEach(stopWord => {
        if (responseContent.startsWith(stopWord)) {
          responseContent = responseContent.replace(stopWord, '');
        }
      });
    }
  }

  // parse function call if it is one and use that as output
  if (response.function_call) {
    const functionCall = parseFunctionCall(response.function_call);
    functionCallName = functionCall.name;
    responseContent = functionCall.message;
    logged_response_content = responseContent;
    console.log('function called!: ', functionCallName);
  }

  console.log(responseContent);
  return {
    content: responseContent,
    retries: response.retries,
    ms: response.ms,
    functionCallName: functionCallName,
  };
};

export function parseFunctionCall(function_call: {name: string, arguments: string}): {name: string, message: string} {
  const function_name = function_call.name;
  const function_arguments = JSON.parse(function_call.arguments);
  return {
    name: function_name,
    message: function_arguments.reason
  }
}