const express    = require('express');
const app        = express();
const request    = require('request');
const PORT       = process.env.PORT || '3000';
const cheerio    = require('cheerio');
const cors       = require('cors');
const bodyParser = require('body-parser');

// Enable cross-origin requests:
app.use(cors());

// Sets up the Express app to handle data parsing:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

//grabs the zip url from the body of the POST request as well as the UUID so no crossing of routes.
//Creates and sends back a JSON response of the jobs information.
app.post('/:uuid', (req, res) => {
    try {
        console.log(req.body.url);
        !req.body ? res.send('Nothing came through, make sure the call was made correctly') :
        request(req.body.url, (err, body, html) => {
            let title;
            let location;
            let desc;
            let link;
            const jobbies = [];
            const $ = cheerio.load(html);
        
            $('div.job_content').each((i, e) => {
                title = $(e).find('span.just_job_title').text();
                location = $(e).find('a.t_location_link').text();
                desc = $(e).find('p.job_snippet').text();
                link = $(e).find('a').attr('href');
                jobbies.push({
                    title: title,
                    location: location,
                    desc: desc,
                    link: link
                });
            })
            return res.send(jobbies);
        });
    } catch (error) {
        res.status(500).json({
            error: error.toString()
        });
    }
})

//send 404
app.use((req,res) => {
    res.status(404);
    res.type('txt').send('404: Sorry, information not found');
})

//start server
app.listen(PORT, () => {
    console.log ("Up and running on " + PORT);
})