import { LogEntry } from "./LogParser";

export interface CountAndAverage {
    count: number;
    average: number;
}

export class LogAnalyser {
    constructor(private logEntries: LogEntry[]) { }

    getDurationEntries() {
        return this.logEntries
            .filter(entry => entry.action === 'operation-responsetime')
            .filter(entry => entry.duration >= 0);
    }

    getOperationTypeCounts() {
        const mapOfCounts = new Map<string, number>();
        this.logEntries.filter(entry => entry.operationType !== '').forEach(
            entry => mapOfCounts.set(entry.operationType, (mapOfCounts.get(entry.operationType) || 0) + 1)
        );
        return mapOfCounts;
    }

    getOperationCounts() {
        const mapOfOperationCounts = new Map<string, number>();
        this.logEntries.filter(entry => entry.action === 'operation').forEach(
            entry => mapOfOperationCounts.set(entry.operation, (mapOfOperationCounts.get(entry.operation) || 0) + 1)
        );
        return mapOfOperationCounts;
    }

    getAverageGroupedByType() {
        const mapOfAverages = new Map<string, CountAndAverage>();
        this.getDurationEntries().forEach(entry => {
            const currentAverage = mapOfAverages.get(entry.operationType) || { count: 0, average: 0 };
            mapOfAverages.set(
                entry.operationType,
                { 
                    count: currentAverage.count + 1,
                    average: currentAverage.average + (entry.duration - currentAverage.average) / (currentAverage.count + 1),
                }
            );
        });
        return mapOfAverages;
    }

    getAverageGroupedByOperation() {
        const mapOfAverages = new Map<string, CountAndAverage>();
        this.getDurationEntries().forEach(entry => {
            const currentAverage = mapOfAverages.get(entry.operation) || { count: 0, average: 0 };
            mapOfAverages.set(
                entry.operation,
                { 
                    count: currentAverage.count + 1,
                    average: currentAverage.average + (entry.duration - currentAverage.average) / (currentAverage.count + 1),
                }
            );
        });
        return mapOfAverages;
    }

    getMaxGroupedByType() {
        const mapOfMax = new Map<string, number>();
        this.getDurationEntries().forEach(entry => {
            if (mapOfMax.get(entry.operationType) || 0 < entry.duration) {
                mapOfMax.set(entry.operationType, entry.duration);
            }
        });
        return mapOfMax;
    }

    getMaxGroupedByOperation() {
        const mapOfMax = new Map<string, number>();
        this.getDurationEntries().forEach(entry => {
            if (mapOfMax.get(entry.operation) || 0 < entry.duration) {
                mapOfMax.set(entry.operation, entry.duration);
            }
        });
        return mapOfMax;
    }

    getMinGroupedByType() {
        const mapOfMin = new Map<string, number>();
        this.getDurationEntries().forEach(entry => {
            if (mapOfMin.get(entry.operationType) || Infinity > entry.duration) {
                mapOfMin.set(entry.operationType, entry.duration);
            }
        });
        return mapOfMin;
    }

    getMinGroupedByOperation() {
        const mapOfMin = new Map<string, number>();
        this.getDurationEntries().forEach(entry => {
            if (mapOfMin.get(entry.operation) || Infinity > entry.duration) {
                mapOfMin.set(entry.operation, entry.duration);
            }
        });
        return mapOfMin;
    }
}