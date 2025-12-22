import { Injectable } from '@angular/core';
import { OptionGroup, Option } from '../../shared/models/selection.models';

@Injectable({ providedIn: 'root' })
export class OptionsService {
    private readonly groupedOptions: OptionGroup[] = [
        {
            category: "front salto's",
            options: [
                { label: '- o', value: 0.1 }, { label: '- <', value: 0.1 },
                { label: '.1', value: 0.2 }, { label: '.2', value: 0.3 },
                { label: '.3 .4', value: 0.4 }, { label: '-3.4', value: -0.4 }
            ]
        },
        {
            category: "back salto's",
            options: [
                { label: '3.4', value: 0.5 }, { label: '4.', value: 0.6 },
                { label: '5.', value: 0.7 }, { label: '6.', value: 0.8 },
                { label: '7.', value: 0.9 }, { label: '8.', value: 1.0 }
            ]
        },
        {
            category: "Other",
            options: [
                { label: '(', value: 0.0 }, { label: 'H', value: 0.1 },
                { label: 'F', value: 0.2 }, { label: '^', value: 0.3 }
            ]
        }
    ];

    groups = () => this.groupedOptions;

    getOptionsMap(): Map<string, Option> {
        const flat = this.groupedOptions.flatMap(g => g.options);
        return new Map(flat.map(o => [o.label, o]));
    }
}