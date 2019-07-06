const User = require('./model');
const Initiative = require('../initiative/repository');

const saveUser = (data, saveCb) => {
    const user = new User(data);
    return user.save(saveCb);
};

const editUser = (user, data, saveCb) => {
    if (data.password) {
        if (!data.check_password) {
            return saveCb({errors: [{
                path: 'password',
                message: 'Require check_password field for change password'
            }]});
        }
        return user.verifyPassword(data.check_password)
        .then(data => {
            if(!data) {
                return saveCb({
                    errors: [{
                        path: 'password',
                        message: 'check_password is not correct'
                }]});
            }
            user.set(data);
            return user.save(saveCb);
        })
        .catch(err => saveCb(err));
    }
    if (data.token) {
        return saveCb({
            errors: [{
                path: 'token',
                message: 'You could not set token'
        }]});
    }
    if (data.voted) {
        return saveCb({
            errors: [{
                path: 'token',
                message: 'You could not set voted'
        }]});
    }
    user.set(data);
    return user.save(saveCb);
};

const deleteUser = (user) => user.remove();

const findUserByID = (id) => User.findById(id);

const findUserByUsername = (username) => User.findOne({username}).select({token: 0, password: 0, email: 0});

const findUsernamesById = (idArr) => User.where('_id').in(idArr).select('username');

const addInitiativeToUser = async (user, initiativeId, saveCb) => {
    const _user = await User.findById(user.id);
    await _user.set('voted', user.voted.filter(initiative => !initiative.equals(initiativeId)).concat(initiativeId));
    return _user.save(saveCb);
};

const removeInitiativeFromUser = async (user, initiativeId, saveCb) => {
    const _user = await User.findById(user.id);
    await _user.set('voted', user.voted.filter(initiative => !initiative.equals(initiativeId)));
    return _user.save(saveCb);
};

const voteForInitiative = async (user, initiativeId, _vote,saveCb) => {
    //console.log(user + " " + initiativeId+ " "+ _vote);
    //const _user = await User.findById(user.id);
    //console.log(user);
    //const _initiative = Initiative.findInitiativeByID(initiativeId);
    await user.history.push({initiative: initiativeId, vote: _vote});
    return user.save(saveCb);
};

const selectUserPublicInfo = (user) => User.findById(user.id).select({token: 0, password: 0});

module.exports = {
    saveUser,
    editUser,
    deleteUser,
    findUserByID,
    findUserByUsername,
    findUsernamesById,
    selectUserPublicInfo,
    addInitiativeToUser,
    removeInitiativeFromUser,
    voteForInitiative
};
