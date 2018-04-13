const Telegraf = require('telegraf');
const fs = require('fs');
const session = require('telegraf/session');
const Markup = require('telegraf/markup');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { authorize } = require('./googleAuth');
const { addRow } = require('./googleQueries');
require('dotenv').config();
const texts = require('./texts');
const { enter } = Stage;
const globalObj = {};

const phoneScene = new Scene('phone');
phoneScene.enter(ctx => {
    return ctx.reply(texts.howToConnect, Extra.markup((markup) => {
        return markup.resize()
            .keyboard([
                markup.contactRequestButton(texts.answerButton),
            ])
    }))
});
phoneScene.on('message', ctx => {
    if (ctx.message.contact) {
        globalObj[ctx.message.chat.id] = {
            id: ctx.message.chat.id
        };
        globalObj[ctx.message.chat.id].phone = ctx.message.contact.phone_number;
        globalObj[ctx.message.chat.id].fullname = `${ctx.message.from.first_name || ""} ${ctx.message.from.last_name || ""}`;
        return ctx.scene.enter('start');
    }
    return ctx.reply(texts.howToConnect, Extra.markup((markup) => {
        return markup.resize()
            .keyboard([
                markup.contactRequestButton(texts.answerButton),
            ])
    }))
});

/**
 * Start Scene
 * @type {BaseScene}
 */

const startScene = new Scene('start');
startScene.enter(ctx => {
    return ctx.reply(texts.chooseVacancy)
});
startScene.on('message', ctx => {
    const key = ctx.message.chat.id.toString();
    globalObj[key].vacancy = ctx.message.text;
    ctx.scene.enter('city');
});

/**
 * City Scene
 */

const cityScene = new Scene('city');
const cities = texts.citiesRange;
cityScene.enter(ctx => {
    return ctx.reply(texts.chooseCity, Extra.markup(m =>
        m.inlineKeyboard([
            [m.callbackButton(cities[0], cities[0]),
                m.callbackButton(cities[1], cities[1])],
            [m.callbackButton(cities[2], cities[2]),
                m.callbackButton(cities[3], cities[3])],
            [m.callbackButton(cities[4], cities[4]),
                m.callbackButton(cities[5], cities[5])]
        ])))
});
cityScene.action(cities, ctx => {
    globalObj[ctx.update.callback_query.from.id].city = ctx.match;
    ctx.scene.enter('salary');
});
cityScene.on('message', ctx => ctx.reply(texts.chooseCity));

/**
 * Salary Scene
 */

const salaryScene = new Scene('salary');
const salaries = texts.salaryRange;
salaryScene.enter(ctx => {
    return ctx.reply(texts.salary, Extra.markup(m =>
        m.inlineKeyboard([
            [
                m.callbackButton(salaries[0], salaries[0]),
                m.callbackButton(salaries[1], salaries[1])
            ],
            [
                m.callbackButton(salaries[2], salaries[2]),
                m.callbackButton(salaries[3], salaries[3])
            ],
            [
                m.callbackButton(salaries[4], salaries[4]),
                m.callbackButton(salaries[5], salaries[5]),
            ],
            [
                m.callbackButton(salaries[6], salaries[6]),
            ]
        ])))
});
salaryScene.action(salaries, ctx => {
    globalObj[ctx.update.callback_query.from.id].salary = ctx.match;
    ctx.scene.enter('experience');
});
salaryScene.on('message', ctx => ctx.reply(texts.chooseSalary));

/**
 * Experience Scene
 */

const experienceScene = new Scene('experience');
const experience = texts.experienceRange;

experienceScene.enter(ctx => {
    return ctx.reply(texts.experience, Extra.markup(m =>
        m.inlineKeyboard([
            [
                m.callbackButton(experience[0], experience[0]),
                m.callbackButton(experience[1], experience[1])
            ],
            [
                m.callbackButton(experience[2], experience[2]),
                m.callbackButton(experience[3], experience[3])
            ]
        ])))
});
experienceScene.action(experience, ctx => {
    globalObj[ctx.update.callback_query.from.id].experience = ctx.match;
    ctx.scene.enter('education');
});
experienceScene.on('message', ctx => ctx.reply(texts.experience));

/**
 * Education Scene
 */

const educationScene = new Scene('education');
const education = texts.educationRange;

educationScene.enter(ctx => {
    return ctx.reply(texts.education, Extra.markup(m =>
        m.inlineKeyboard([
            [
                m.callbackButton(education[0], education[0]),
                m.callbackButton(education[3], education[3])
            ],
            [
                m.callbackButton(education[1], education[1])
            ],
            [
                m.callbackButton(education[2], education[2])
            ],
            [
                m.callbackButton(education[4], education[4]),
                m.callbackButton(education[5], education[5])
            ]
        ])))
});
educationScene.action(education, ctx => {
    globalObj[ctx.update.callback_query.from.id].education = ctx.match;
    ctx.scene.enter('citizen');
});
educationScene.on('message', ctx => ctx.reply(texts.education));

/**
 * Citizen scene
 */

const citizenScene = new Scene('citizen');
const citizen = texts.citizenRange;

citizenScene.enter(ctx => {
    return ctx.reply(texts.citizen, Extra.markup(m =>
        m.inlineKeyboard([
            [
                m.callbackButton(citizen[0], citizen[0]),
                m.callbackButton(citizen[1], citizen[1])
            ],
            [
                m.callbackButton(citizen[2], citizen[2]),
                m.callbackButton(citizen[3], citizen[3])
            ]
        ])))
});
citizenScene.action(citizen, ctx => {
    globalObj[ctx.update.callback_query.from.id].citizen = ctx.match;
    ctx.scene.enter('age');
});
citizenScene.on('message', ctx => ctx.reply(texts.citizen));


/**
 * Age
 */
const ageScene = new Scene('age');
const age = texts.ageRange;

ageScene.enter(ctx => {
    return ctx.reply(texts.age, Extra.markup(m =>
        m.inlineKeyboard([
            [
                m.callbackButton(age[0], age[0]),
                m.callbackButton(age[1], age[1])
            ],
            [
                m.callbackButton(age[2], age[2]),
                m.callbackButton(age[3], age[3])
            ],
            [
                m.callbackButton(age[2], age[2])
            ]
        ])))
});
ageScene.action(age, ctx => {
    globalObj[ctx.update.callback_query.from.id].age = ctx.match;
    ctx.scene.enter('sex');
});
ageScene.on('message', ctx => ctx.reply(texts.age));

/**
 * Sex
 */

const sexScene = new Scene('sex');
const sex = texts.sexRange;

sexScene.enter(ctx => {
    return ctx.reply(texts.sex, Extra.markup(m =>
        m.inlineKeyboard([
            [
                m.callbackButton(sex[0], sex[0]),
                m.callbackButton(sex[1], sex[1])
            ],
            [
                m.callbackButton(sex[2], sex[2]),
            ]
        ])))
});
sexScene.action(sex, ctx => {
    globalObj[ctx.update.callback_query.from.id].sex = ctx.match;
    ctx.scene.enter('term');
});
sexScene.on('message', ctx => ctx.reply(texts.sex));

/**
 * Term
 */

const termScene = new Scene('term');
const term = texts.termRange;

termScene.enter(ctx => {
    return ctx.reply(texts.term, Extra.markup(m =>
        m.inlineKeyboard([
            [
                m.callbackButton(term[0], term[0]),
                m.callbackButton(term[1], term[1])
            ],
            [
                m.callbackButton(term[2], term[2]),
                m.callbackButton(term[3], term[3])
            ],
            [
                m.callbackButton(term[2], term[2])
            ]
        ])))
});
termScene.action(term, ctx => {
    globalObj[ctx.update.callback_query.from.id].term = ctx.match;
    ctx.scene.enter('workType');
});
termScene.on('message', ctx => ctx.reply(texts.term));

/**
 * Work type
 */

const workTypeScene = new Scene('workType');
const workType = texts.workRange;

workTypeScene.enter(ctx => {
    return ctx.reply(texts.workType, Extra.markup(m =>
        m.inlineKeyboard([
            [
                m.callbackButton(workType[0], workType[0]),
                m.callbackButton(workType[1], workType[1])
            ],
            [
                m.callbackButton(workType[2], workType[2]),
                m.callbackButton(workType[3], workType[3])
            ],
            [
                m.callbackButton(workType[2], workType[2])
            ]
        ])))
});
workTypeScene.action(workType, ctx => {
    globalObj[ctx.update.callback_query.from.id].workType = ctx.match;
    ctx.scene.enter('period');
});
workTypeScene.on('message', ctx => ctx.reply(texts.workType));

/**
 * Period
 */

const periodScene = new Scene('period');
const period = texts.periodRange;

periodScene.enter(ctx => {
    return ctx.reply(texts.period, Extra.markup(m =>
        m.inlineKeyboard([
            [
                m.callbackButton(period[0], period[0]),
                m.callbackButton(period[1], period[1])
            ],
            [
                m.callbackButton(period[2], period[2]),
                m.callbackButton(period[3], period[3])
            ]
        ])))
});
periodScene.action(period, ctx => {
    globalObj[ctx.update.callback_query.from.id].period = ctx.match;
    ctx.scene.enter('description');
});
periodScene.on('message', ctx => ctx.reply(texts.period));

/**
 * Start Scene
 * @type {BaseScene}
 */

const descriptionScene = new Scene('description');
descriptionScene.enter(ctx => {
    return ctx.reply(texts.description)
});
descriptionScene.on('message', ctx => {
    const key = ctx.message.chat.id.toString();
    globalObj[key].description = ctx.message.text;
    ctx.scene.enter('final');
});

/**
 * Thanks
 */

const thanksScene = new Scene('thanks');
const thanks = texts.thanksRange;

thanksScene.enter(ctx => {
    return ctx.reply(texts.thanks, Extra.markup(m =>
        m.inlineKeyboard([
            [
                m.callbackButton(thanks[0], thanks[0]),
                m.callbackButton(thanks[1], thanks[1])
            ]
        ])))
});
thanksScene.action(thanks, ctx => {
    globalObj[ctx.update.callback_query.from.id].thanks = ctx.match;
    ctx.scene.enter('final');
});
thanksScene.on('message', ctx => ctx.reply(texts.thanks));

/**
 * Final
 */

const finalScene = new Scene('final');
finalScene.enter(ctx => {
    console.log(ctx.message.chat.id);
    fs.readFile('client_secret.json', (err, content) => {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }

        // Authorize a client with the loaded credentials, then call the Google Sheets API.
        authorize(JSON.parse(content))
            .then(doc => {
                console.log(globalObj);
                addRow(doc, [
                    globalObj[ctx.message.chat.id].phone,
                    globalObj[ctx.message.chat.id].fullname,
                    globalObj[ctx.message.chat.id].vacancy,
                    globalObj[ctx.message.chat.id].city,
                    globalObj[ctx.message.chat.id].salary,
                    globalObj[ctx.message.chat.id].experience,
                    globalObj[ctx.message.chat.id].education,
                    globalObj[ctx.message.chat.id].citizen,
                    globalObj[ctx.message.chat.id].age,
                    globalObj[ctx.message.chat.id].sex,
                    globalObj[ctx.message.chat.id].term,
                    globalObj[ctx.message.chat.id].workType,
                    globalObj[ctx.message.chat.id].period,
                    globalObj[ctx.message.chat.id].description,
                    globalObj[ctx.message.chat.id].id
                ])
                    .then(doc => {
                        delete globalObj[ctx.message.chat.id];
                        ctx.scene.leave('final');
                        return ctx.reply(texts.final);
                    })
                    .catch(console.error);
            })
            .catch(console.error)
    });

});

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Stage([
    phoneScene, startScene, cityScene,
    salaryScene, workTypeScene, periodScene,
    citizenScene, educationScene, experienceScene,
    termScene, sexScene, ageScene,
    thanksScene, finalScene, descriptionScene
]);
bot.use(session());
bot.use(stage.middleware());
bot.command('start', enter('phone'));
bot.on('message', ctx => ctx.reply(texts.activation));
bot.action(/.+/, ctx => ctx.reply(texts.activation));
bot.startPolling();