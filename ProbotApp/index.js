/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

const endpoint = "https://textanalyticssamplesb.cognitiveservices.azure.com/";
const apiKey = "d585b702d72d4be59f22de8e69a43f94";
const documents = [];
const newComment = "Hello from sentiment analysis.";

module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on(['issues.opened'], async (context) => {
    app.log.info(context);
    const issueComment = context.payload.issue.body;
    app.log.info(issueComment);
   documents.push(issueComment);
   const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(apiKey));
   const results = await client.analyzeSentiment(documents);
    const result = results[0];
    if(!result.error) {
      app.log.info(result.sentiment);
      if (result.sentiment == 'negative') {
        newComment += "Please note the code of conduct for this repository and be respectful to other users.";
      }
    }

    const addedissueComment = context.issue({
      body: newComment
    });
    return context.octokit.issues.createComment(addedissueComment);
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
