
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
title: faker.lorem.sentence(""),
category: faker.lorem.sentence(""),
youtubeUrl: faker.lorem.sentence(""),
content: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
