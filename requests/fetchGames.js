import moment from "moment";

export default async () => {
    try {
        const response = await fetch('http://ottawasoftball.us-east-1.elasticbeanstalk.com/games?teamID=' + 1)
            .then(res => {
                if(!res.ok) {
                    return res.text().then(text => { throw new Error(text) })
                }
                else {
                    return res.json();
                }
            })
            .catch(err => {
                console.log(err);
            });
        const now = moment()
        return response?.games.map((game) => {
            const date = moment(game.date)
            game.dateString = date.format('YYYY-MM-DD');
            game.moment = date;
            return game;
        });
    } catch (error) {
        console.error(error);
    }
}
