const Initiative = require('./model');
const User = require('../user/model');
const UserRepository = require('../user/repository');


const saveInitiative = (data, saveCb) => {
    const user = new Initiative(data);
    return user.save(saveCb);
};

const editInitiative = (Initiative, data, saveCb) => {
    Initiative.set(data);
    return Initiative.save(saveCb);
};

const deleteInitiative = (Initiative) => Initiative.remove();

const findInitiativeByID = (id) => Initiative.findById(id);

const findInitiativesByID = (idArr) => Initiative.where('_id').in(idArr);

const findAllInitiatives = () => Initiative.find();

const findAllInitiativesByUsername = (username) => Initiative.find({creator: username});

const findInitiativesForUser = async (username) => {
    let notIn = username.history.map(val => val.initiative._id);
    let finded = await Initiative.find({_id: { $nin: notIn}});
    return finded;
};

const addUserToInitiative = async (Initiative, user, saveCb) => {
    const _Initiative = await Initiative.findById(Initiative.id);
    await _Initiative.set('voters', Initiative.voters.filter(userId => !userId.equals(user.id)).concat(user._id));
    return _Initiative.save(saveCb);
};

const removeUserFromInitiative = async (Initiative, user, saveCb) => {
    const _Initiative = await Initiative.findById(Initiative.id);
    await _Initiative.set('voters', Initiative.voters.filter(userId => !userId.equals(user.id)));
    await _Initiative.save();
    await Initiative.find({ voters: { $exists: true, $size: 0}}).remove().exec();
};

const updateRatingByVote = async (initiative, vote, saveCb) => {
    return await Initiative.findOneAndUpdate({_id: initiative}, {$inc: {rating: (vote === 'Dislike') ? -1 : 1}});
};

const updateHistory = async (initiative, vote, saveCb) => {
    const _Initiative = await Initiative.find({_id: initiative});
    console.log(_Initiative);
    _Initiative.history.push({dateOfVoting: Date.now(), vote: vote});
    return await _Initiative.save(saveCb);
};

module.exports = {
    saveInitiative,
    editInitiative,
    deleteInitiative,
    findInitiativeByID,
    findInitiativesByID,
    findAllInitiatives,
    addUserToInitiative,
    removeUserFromInitiative,
    findInitiativesForUser,
    findAllInitiativesByUsername,
    updateRatingByVote,
    updateHistory
};
