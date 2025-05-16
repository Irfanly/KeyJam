
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
userId: faker.lorem.sentence(""),
title: faker.lorem.sentence(""),
artist: faker.lorem.sentence(""),
key: faker.lorem.sentence(""),
audioFileName: faker.lorem.sentence(""),
audioFileUrl: faker.lorem.sentence(""),
lyrics: faker.lorem.sentence(""),
lyricsWithChords: faker.lorem.sentence(""),
suggestedChords: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
