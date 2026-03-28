const File=require("../models/file")
exports.uploadFile=async(req,res)=>{
  try{
    const file=new File({
      filename:req.file.filename,
      path:req.file.path,
      size:req.file.size,
      userId:req.user.id,
    })
    await file.save();
    res.json({message:"File saved successfully"});
  }
  catch(err){
    console.log(err.message);
  }
}
exports.getFiles=async(req,res)=>{
  try{
    const files=await File.find({userId:req.user.id})
    res.json(files);
  }
  catch(err){
    console.log(err.message);
  }
}
exports.deleteFile=async(req,res)=>{

    try {
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: "File deleted" });
  } catch (err) {
    res.json({ error: err.message });
  }
}
