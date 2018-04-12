
const google = require('googleapis');
const sheets = google.sheets('v4');
const spreadsheetId = '1R9_Xq6xnBQL4K-B7FqKOhQMm1s4wjt9Jt2g6e5TI9wA';

module.exports = {

    addRow: (auth, row) => {
        return new Promise(resolve => {
            sheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: 'A:B',
                insertDataOption: 'INSERT_ROWS',
                valueInputOption: 'RAW',
                resource: {
                    values: [row]
                }
            }, (err, response) => {
                if (err) throw err;
                resolve(response)
            });
        })
    },

};

