import { IRawPage } from "@Interfaces/IStore";

export default {
    pageId: "Contact",
    simTypes: [{
        simTypeId: "contact",
        sourceText: "12345",
    }],

    sourceText_: "~s~" + "~Cindent0~{~l0~" +
        "~Cindent1~" + "\"_comment\": \"Looking to stay in touch?\"," + "~l0~" +
        "~Cindent1~" + "\"contact options\": {" + "~l0~" +
        "~Cindent2~" + "\"email\":" + "~cspace~    \"" + "~c0~" + "matt.s.schiller(at)gmail(dot)com" +
        "~amailto:matt.s.schiller@gmail.com~" + "~c0~\"" + "~l0~" +
        "~s~" +

        "~Cindent2~" + "\"linkedIn\": \"" + "~c0~" + "www.linkedIn.com/in/MattSchiller" +
        "~ahttps://www.linkedIn.com/in/MattSchiller~" + "~c0~\"" + "~l0~" +
        "~Cindent2~" + "\"gitHub\":" + "~cspace~   \"" + "~c0~" + "www.gitHub.com/MattSSchiller" +
        "~ahttps://www.gitHub.com/MattSSchiller~" + "~c0~\"" + "~l0~" +
        "~Cindent1~" + "}" + "~l0~" +
        "~Cindent0~" + "}"
} as IRawPage;
