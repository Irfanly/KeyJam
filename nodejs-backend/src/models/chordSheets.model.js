
    module.exports = function (app) {
        const modelName = 'chord_sheets';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            userId: { type:  String , required: true, maxLength: null },
title: { type:  String , required: true },
artist: { type:  String , required: true },
key: { type:  String , required: true },
audioFileName: { type:  String , required: true },
audioFileUrl: { type:  String , required: true },
lyrics: { type:  String , required: true },
lyricsWithChords: { type:  String , required: true },
suggestedChords: { type:  String , required: true },

            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };