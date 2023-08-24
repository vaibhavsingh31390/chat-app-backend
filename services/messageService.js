const userModel = require("./../models/userModel");
const messageModel = require("./../models/messageModel");

exports.setDelivered = async (data) => {
  try {
    let response = null;
    const messages = await messageModel.updateMany({'from._id': data.from._id,}, {status: 'delivered'}, {multi : true});
    if (messages) {
      response = {
        statusMessage: "success",
        payload: {
          reqTime: Date.now(),
          status: "Marked delivered",
          messages: { messages },
        },
      };
    }else{
        response = {
            statusMessage: "success",
            payload: {
              reqTime: Date.now(),
              status: "Marked delivered",
              messages: 'No messages found.'
            },
          };
    }
    return response;
  } catch (error) {
    response = {
        statusMessage: "failed",
        payload: {
          reqTime: Date.now(),
          status: "Marked delivered failed",
          error: error,
        },
      };
    return response
  }
};


exports.setSeen = async (data) => {
    try {
      let response = null;
      const messages = await messageModel.updateMany({'from._id': data.match._id, 'to._id': data.user._id }, {status: 'seen'}, {multi : true});
      if (messages) {
        response = {
          statusMessage: "success",
          payload: {
            reqTime: Date.now(),
            status: "Marked seen",
            messages: { messages },
            messag: data.match._id,
          },
        };
      }else{
          response = {
              statusMessage: "success",
              payload: {
                reqTime: Date.now(),
                status: "Marked seen",
                messages: 'No messages found.'
              },
            };
      }
      return response;
    } catch (error) {
      response = {
          statusMessage: "failed",
          payload: {
            reqTime: Date.now(),
            status: "Marked seen failed",
            error: error,
          },
        };
      return response
    }
  };
