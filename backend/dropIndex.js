// fixShareIdIndex.js
const mongoose = require("mongoose");
const File = require("./models/file"); 
mongoose.connect("mongodb://127.0.0.1:27017/secureStorage");
mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");

  try {
   
    const duplicates = await File.aggregate([
      { $match: { shareId: null } },
      {
        $group: {
          _id: "$shareId",
          count: { $sum: 1 },
          ids: { $push: "$_id" },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);

    for (let dup of duplicates) {
      const idsToDelete = dup.ids.slice(1); // keep 1, delete the rest
      await File.deleteMany({ _id: { $in: idsToDelete } });
      console.log(`Deleted ${idsToDelete.length} duplicate files with shareId null`);
    }

    // 2️⃣ Drop the old index
    await File.collection.dropIndex("shareId_1");
    console.log("Old shareId index dropped successfully");

    console.log("All done. Restart your server now.");
  } catch (err) {
    console.log("Error:", err.message);
  }

  mongoose.connection.close();
});