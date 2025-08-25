import { AppErr } from "../../middleware/catcherr.js";
import { chatModel } from "../../model/chat.model.js";
import { userModel } from "../../model/user.model.js";

export const getchat = async(req, res, next) => {};

export const accesschat = async (req, res, next) => {
   
  
  const { userId } = req.body;
  
  
  if (!userId) next(new AppErr("Please provide user id"));

  let ischat = await chatModel
    .find({
      isGroup: false,
      users: { $all: [req.user._id, userId] },
    })
    .populate("users", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "-password ",
      },
    })
    .sort({ updatedAt: -1 });
     

  // لو فيه شات موجود، رجعه
  if (ischat.length > 0) {
    return res.status(200).json(ischat[0]);
  }

  // لو مفيش شات، أنشئ شات جديد
  const newChatData = {
    chatname: "sender",
    isGroup: false,
    users: [req.user._id, userId],
  };

  const createdChat = await chatModel.create(newChatData);
  // بعد الإنشاء، نعمل populate ونرجعه
  const fullChat = await chatModel
    .findById(createdChat._id)
    .populate("users", "-password");

  return res.status(201).json(fullChat);
};

export const fetchchat = async (req, res, next) => {
   
  const chat = await chatModel
    .find({ users: { $in: [req.user._id] } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .sort({
      updatedAt: -1,
    });
     
  res.status(200).json(chat);
};

export const createGroup = async (req, res, next) => {
  const { chatname, users } = req.body;
 
 
  let usersarr = JSON.parse(users);

  if (!chatname) next(new AppErr("Please provide chat name"));
  if (!users) next(new AppErr("Please provide users"));
  if (users.length < 2) next(new AppErr("Please provide at least 2 users"));
  usersarr.push(req.user);

  const groupChat = await chatModel.create({
    chatname,
    isGroup: true,
    users: usersarr,
    groupAdmin: req.user,
  });
  await groupChat.save();

  const fullchat = await chatModel
    .findById(groupChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  res.status(201).json(fullchat);
};

export const renameGroup = async (req, res, next) => {
  const { chatname, groupid } = req.body;
  const updatechat = await chatModel
    .findByIdAndUpdate(
      groupid,
      {
        chatname,
      },
      {
        new: true,
      }
    )
    .populate("users", "-password");
  if (!updatechat) {
    next(new AppErr("Group not found", 400));
  }

  res.status(200).json(updatechat);
};
export const addtoGroup = async (req, res, next) => {
  const { groupid, userid } = req.body;
  const updatedChat = await chatModel
    .findByIdAndUpdate(
      groupid,
      {
        $addToSet: { users: userid },
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return next(new AppErr("Group not found", 404));
  }

  res.status(200).json(updatedChat);
};
export const removefromGroup = async (req, res, next) => {
  const updatedChat = await chatModel
    .findByIdAndUpdate(
      groupid,
      {
        $pull: { users: userid },
      },
      { new: true }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return next(new AppErr("Group not found", 404));
  }

  res.status(200).json(updatedChat);
};
