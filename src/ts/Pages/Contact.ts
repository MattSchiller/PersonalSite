import { IRawPage } from "@Redux/Interfaces/IStore";

export const Contact: IRawPage = {
    pageId: "contact.yaml",
    iconUrl: "assets/images/yamlIcon.png",
    language: "yaml",
    simTypes: [{
        simTypeId: "contact",
        sourceText:
            // tslint:disable:max-line-length
            "~s~" +
            "~ccomment~" + "# Looking to stay in touch?" +
            "~l~" +
            "~cflat-file-key~" + "contactOptions" + "~csymbol~:" +
            "~l~" +
            "~cindent1 flat-file-key~email" + "~csymbol~: " + "~cstring~matt.s.schiller(at)gmail(dot)com" +
            "~amailto: matt.s.schiller@gmail.com~" +
            "~l~" +
            "~s~" +
            "~cindent1 flat-file-key~linkedIn" + "~csymbol~: " + "~cstring~www.linkedIn.com/in/MattSchiller" +
            "~ahttps://www.linkedIn.com/in/MattSchiller~" +
            "~l~" +
            "~cindent1 flat-file-key~gitHub" + "~csymbol~: " + "~cstring~www.gitHub.com/MattSSchiller" +
            "~ahttps://www.gitHub.com/MattSSchiller~" +
            "~l~"
    }]
};
