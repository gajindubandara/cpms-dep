import { Parser as Json2csvParser } from 'json2csv';

export function exportToCSV(data, fields, filename, res) {
    const json2csvParser = new Json2csvParser({ fields });
    const csv = json2csvParser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    return res.send(csv);
}
