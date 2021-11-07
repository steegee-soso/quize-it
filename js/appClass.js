class Quiz {

    constructor() {
        //this.url = "https://opentdb.com/api.php?amount=1&category=9&difficulty=easy";
        // i ust added a comment in the app class code
        this.url = "https://opentdb.com/api.php?amount=1&category=9&type=multiple";
    }

    async fetchQuestions() {
        const request = await fetch(this.url);
        const response = await request.json();
        return { response };
    }
}