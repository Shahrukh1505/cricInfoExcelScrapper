const exportUsersToExcel = require('./exportService');
const exportBowler = require('./export');
const cheerio = require('cheerio');
const request = require('request');


request('https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results', reqCallback);

function reqCallback(err, res, html){
    if(err){
        console.error('error',err);
    }
    else{
        extractHtml(html);
    }
}

function extractHtml(html){
    const $ = cheerio.load(html);
    const scorecardTag = $('.match-cta-container>a');
    let scoreCardUrls = [];
  let scoreId;
  let id = [];
    for(let i = 2;i<scorecardTag.length;i+=4){
       let str = $(scorecardTag[i]).attr('href');
        let url = "https://www.espncricinfo.com" + str;
        scoreId = str.split('/').slice(3)[0];
        scoreId = scoreId.split('-');
        scoreId = scoreId[scoreId.length - 1];
     id.push(scoreId);
        scoreCardUrls.push(url);
    }
    
    for(let i = 0;i<scoreCardUrls.length;i++){
        request(scoreCardUrls[i], reqScoreCard.bind(this,id[i]));
    }
    

  
}

function reqScoreCard(match,err,res,html){
    if(err){
        console.error('error',err);
    }
    else{
        
        scoreTables(html,match);
    }
}
let count = 0;
function scoreTables(html,match){

    const $ = cheerio.load(html);
   const batsmanTable = $('.table.batsman tbody tr');
   const bowlerTable = $('.table.bowler tbody tr');

const batsman1 = [];
const batsman2 = [];
const bowler1 = [];
const bowler2 = [];
let f = false;
   for(let i =0;i<bowlerTable.length-1;i++){
       let columns = $(bowlerTable[i]).find('td');
    //    let columns2 =  $(bowlerTable[i+1]).find('td');
       if(columns.length == 11){
           bowler1.push({
               "name" : $(columns[0]).text(),
               "overs" : $(columns[1]).text(),
               "maidens" : $(columns[2]).text(),
               "runs" : $(columns[3]).text(),
               "wickets" : $(columns[4]).text(),
               "economy" : $(columns[5]).text(),
               "dots" : $(columns[6]).text(),
               "fours" : $(columns[7]).text(),
               "sixes" : $(columns[8]).text(),
               "wides" : $(columns[9]).text(),
               "noBalls" : $(columns[10]).text(),
           })
       }
 
   }

let flag = false;
for(let i = 0;i<batsmanTable.length;i++){
    let columns = $(batsmanTable[i]).find('td');
    if(columns.length == 8 && flag == false){
       
    batsman1.push({
    "name": $(columns[0]).text(),
    "status": $(columns[1]).text(),
    "runs": $(columns[2]).text(),
    "balls": $(columns[3]).text(),
    "fours": $(columns[5]).text(),
    "sixes": $(columns[6]).text(),
    "strikeRate": $(columns[7]).text(),
    })
  
   }
   else if(columns.length == 4){
       flag = true;
   }
   else if(columns.length == 8 && flag == true){
    batsman2.push({
        "name": $(columns[0]).text(),
        "status": $(columns[1]).text(),
        "runs": $(columns[2]).text(),
        "balls": $(columns[3]).text(),
        "fours": $(columns[5]).text(),
        "sixes": $(columns[6]).text(),
        "strikeRate": $(columns[7]).text(),
        })
   }
}

const schema2 = [

    "Name",
    "Over",
    "Maidens",
    "Runs",
    "Wickets",
    "Economy",
    "Dots",
    "Fours",
    "Sixes",
    "Wides",
    "No Balls"
]

const schema = [
    
    "Name",
    "Status",
    "Runs",
    "Balls",
    "Fours",
    "Sixes",
    "Strike Rate"
  ]
abc(batsman1,schema,match + "-Batsman-1st-innings");
abc(batsman2,schema,match + "-Batsman-2nd-innings");
xyz(bowler1,schema2,match + "-Bowler-Both-innings");
// xyz(bowler2,schema2);



}
function abc(objects,schema,match){

count++;
const workSheetName = match;
const filePath = 'C:/Users/Shahrukh Ansari/Desktop/pep/dev/webScrapping/cricinfoExcel/temp' + count + '.xlsx';
exportUsersToExcel(objects, schema, workSheetName, filePath);
}
function xyz(objects,schema,match){
    count++;
const workSheetName = match;
const filePath = 'C:/Users/Shahrukh Ansari/Desktop/pep/dev/webScrapping/cricinfoExcel/temp' + count + '.xlsx';
exportBowler(objects, schema, workSheetName, filePath);
}

 

