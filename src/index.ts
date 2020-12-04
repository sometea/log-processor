import zlib from 'zlib';
import fs from 'fs';
import readline from 'readline';

import { LogParser } from './LogParser';
import { LogAnalyser } from './LogAnalyser';
import { SQLGenerator } from './SqlGenerator';

const logFile = 'logs.log.gz';
const sqlOutputFile = 'durations.sql';

const logParser = new LogParser();

const lineReader = readline.createInterface({
   input: fs.createReadStream(logFile).pipe(zlib.createGunzip()) 
});

lineReader.on('line', line => logParser.readLine(line));
lineReader.on('close', () => {
    const logAnalyser = new LogAnalyser(logParser.getEntries());

    console.log('Operation type counts:');
    for (const [key, count] of logAnalyser.getOperationTypeCounts()) {
        console.log(`${key}: ${count}`);
    }
    console.log('-----------------');
    console.log('Operation counts:');
    for (const [key, count] of logAnalyser.getOperationCounts()) {
        console.log(`${key}: ${count}`);
    }
    console.log('-----------------');
    console.log('Average times by operation type:');
    for (const [key, value] of logAnalyser.getAverageGroupedByType()) {
        console.log(`${key}: ${value.average}`);
    }
    console.log('-----------------');
    console.log('Average times by operation:');
    for (const [key, value] of logAnalyser.getAverageGroupedByOperation()) {
        console.log(`${key}: ${value.average}`);
    }
    console.log('-----------------');
    console.log('Max times by operation type:');
    for (const [key, max] of logAnalyser.getMaxGroupedByType()) {
        console.log(`${key}: ${max}`);
    }
    console.log('-----------------');
    console.log('Max times by operation:');
    for (const [key, max] of logAnalyser.getMaxGroupedByOperation()) {
        console.log(`${key}: ${max}`);
    }
    console.log('-----------------');
    console.log('Min times by operation type:');
    for (const [key, max] of logAnalyser.getMinGroupedByType()) {
        console.log(`${key}: ${max}`);
    }
    console.log('-----------------');
    console.log('Min times by operation:');
    for (const [key, max] of logAnalyser.getMinGroupedByOperation()) {
        console.log(`${key}: ${max}`);
    }

    const sqlGenerator = new SQLGenerator(logAnalyser);
    sqlGenerator.writeInsertStatements(sqlOutputFile);
});
