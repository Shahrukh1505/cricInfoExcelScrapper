const xlsx = require('xlsx');
const path = require('path');

const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
    const workBook = xlsx.utils.book_new();
    const workSheetData = [
        workSheetColumnNames,
        ... data
    ];
    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, path.resolve(filePath));
}

const exportUsersToExcel = (users, workSheetColumnNames, workSheetName, filePath) => {
    const data = users.map(user => {
        return [user.name, user.status, user.runs,user.balls,user.fours,user.sixes,user.strikeRate];
    });
    exportExcel(data, workSheetColumnNames, workSheetName, filePath);
}

const exportBowler = (users,workSheetColumnNames, worksheetName, filePath) => {
    const data = users.map(user => {
        return [user.name, user.overs,user.maidens,user.runs,user.wickets, user.economy,user.dots,user.fours,user.sixes,user.wides,user.noBalls];
    } );
    exportExcel(data,workSheetColumnNames,worksheetName,filePath);
}

module.exports = exportUsersToExcel;
module.exports = exportBowler;