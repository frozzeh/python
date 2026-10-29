import {writeFileSync} from 'node:fs';
import {generate,testCases} from '../src/lib/generators';
const cases=[];
for(const topic of ['factors','apples','brothers'] as const)for(const difficulty of ['easy','medium','hard'] as const){const ex=generate(topic,difficulty,1337);cases.push({topic,difficulty,code:ex.solution,cases:testCases(ex)})}
writeFileSync('/tmp/python-prep-reference-cases.json',JSON.stringify(cases));
