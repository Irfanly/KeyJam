
module.exports = function (app) {
  const modelName = 'song_analysis';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      userId: { type: String, required: true },

      title: { type: String, required: true },
      artist: { type: String, required: true },

      audioFileName: { type: String, required: true },
      audioFileUrl: { type: String, required: true },

      analysis: {
        melody: { type: String },         // Description of melodic flow
        harmony: { type: String },        // Chordal structure & quality
        rhythm: { type: String },         // Tempo, groove, syncopation
        arrangement: { type: String },    // Structure (intro, chorus, bridge)
        mood: { type: String },           // "uplifting", "somber", etc.
        genre: { type: String },          // "Pop", "Indie Rock", etc.

        compositionScore: {
          type: Number,                   // 0–100 score given by Gemini
          min: 0,
          max: 100
        },

        suggestions: { type: String },    // Tips for improvement (e.g. "Consider adding bridge")
      },

      createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
      updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
    },
    {
      timestamps: true
  });

  
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
  
};