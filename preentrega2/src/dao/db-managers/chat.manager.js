import messageModel from "../models/message.model.js";

class ChatManager {
  async getMessages() {
    try {
      const messages = await messageModel.find().lean();
      return { stat: 200, result: messages };
    } catch (error) {
      return { stat: 400, result: "Error - Can not restaured messages" };
    }
  }

  async newMessage(message) {
    try {
      const result = await messageModel.create(message);
      const messages = await this.getMessages();
      return { stat: 200, result: messages };
    } catch (error) {
      return { stat: 400, result: "Error - Can not save message" };
    }
  }
}

export default ChatManager;
