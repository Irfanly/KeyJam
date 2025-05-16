
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
userId: faker.lorem.sentence(""),
chordSheetId: faker.lorem.sentence(""),
folderName: faker.lorem.sentence(""),
tag: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
