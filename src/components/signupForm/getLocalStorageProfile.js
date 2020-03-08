const keyBy = require('lodash/keyBy');
const each = require('lodash/each');
const get = require('lodash/get');

const ids = {
    '250946': "game_prefs",
    '250947': "casino_prefs",
    '250948': "bingo_prefs",
    '250949': "poker_prefs",
    '250950': "sport_type",
    '250951': "sport_prefs",
    '250952': "operator_value",
    '250953': "payment_type",
    '250954': "bonus_type",
    '250955': "game_frequency",
    '250956': "casino_type",
    '250957': "player_level",
    '250958': "prize_plans",
    '252550': "slots_prefs"
};

const answerContent = result => {
    const { answers = [] } = result;
    return answers.map(x => get(x, 'content', '').toLowerCase());
};

const getProfileFields = idsOpt => resultOpt => {
    const profileFields = [];
    const res = keyBy(resultOpt, o => get(o, 'question.id', ''));

    each(idsOpt, (profileFieldType, id)=> {
        if (!res[id]) return;
        const value = answerContent(res[id])

        if (value.length) {
            profileFields.push({key: profileFieldType, value })
        }
    });

    return profileFields;
};

const getProfileFieldsValues = getProfileFields(ids);

export {
    getProfileFieldsValues,
}
