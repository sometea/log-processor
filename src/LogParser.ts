export interface LogEntry {
    creator: string;
    action: string;
    operation: string;
    operationType: string;
    duration: number;
}

export class LogParser {
    private entries: LogEntry[] = [];

    private findCreator(components: string[]) {
        const componentWithCreator = components.find(component => component.match(/\[.*\]/));
        return componentWithCreator ? componentWithCreator.replace('[', '').replace(/\].*/, '') : '';
    }

    private findAction(components: string[]) {
        const componentWithAction = components.find(component => component.match(/\[*.\]/));
        return componentWithAction ? componentWithAction.replace(/\[.*\]/, '').trim() : '';
    }

    private findOperation(components: string[]) {
        const componentWithOperation = components.find(component => component.match(/operation\:/));
        return componentWithOperation ? componentWithOperation.replace('operation: ', '').trim() : '';
    }

    private findOperationType(components: string[]) {
        const componentWithOperationType = components.find(component => component.match(/operationType\:/));
        return componentWithOperationType ? componentWithOperationType.replace('operationType: ', '').trim() : '';
    }

    private findDuration(components: string[]) {
        const componentWithDuration = components.find(component => component.match(/duration\:/));
        return componentWithDuration ? parseFloat(componentWithDuration.replace('duration: ', '').trim()) : -1;
    }

    private parseLine(line: string) {
        const lineComponents = line.split(' | ');
        return {
            creator: this.findCreator(lineComponents),
            action: this.findAction(lineComponents),
            operation: this.findOperation(lineComponents),
            operationType: this.findOperationType(lineComponents),
            duration: this.findDuration(lineComponents),
        }
    }

    readLine(line: string) {
        this.entries.push(this.parseLine(line));
    }

    getEntries() {
        return this.entries;
    }
}