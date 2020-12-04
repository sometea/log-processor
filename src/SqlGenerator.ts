import { LogAnalyser } from "./LogAnalyser";

import { promises as fs } from 'fs';

export class SQLGenerator {
    constructor(private logAnalyser: LogAnalyser) { }

    generateInsertStatements(): string[] {
        const statementsForAverages: string[] = [];
        this.logAnalyser.getAverageGroupedByOperation().forEach((countAndAverage, key) => {
            statementsForAverages.push(`insert into GraphqlDurations (operation, duration, method) values (${key}, ${countAndAverage.average}, AVG)`);
        });
        return statementsForAverages;
    }

    async writeInsertStatements(filename: string) {
        await fs.writeFile(filename, this.generateInsertStatements().join("\n"));
    }
}