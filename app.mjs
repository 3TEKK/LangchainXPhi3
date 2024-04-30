import { ChatOllama } from "@langchain/community/chat_models/ollama";

import { ChatPromptTemplate } from "@langchain/core/prompts";

import { StringOutputParser } from "@langchain/core/output_parsers";

const outputParser = new StringOutputParser();

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a proffessional interviewer, \
    based on the user input anser the questions and do not give further explanations, make the questions human format \
    get the questions only no further text \
    Avoid providing additional explanations; simply answer  the question"],
  ["user", "{input}"],
]);

const chatModel = new ChatOllama({
  baseUrl: "http://localhost:11434", 
  model: "phi3",
});

const chain = prompt.pipe(chatModel).pipe(outputParser);

var response = await chain.invoke({
                input: "give 3 techncial questions about python only",
              });

console.log(response);
