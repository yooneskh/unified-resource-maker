import { ensureFile } from 'https://deno.land/std@0.220.1/fs/mod.ts';
import { paramCase } from 'https://deno.land/x/case@2.2.0/mod.ts';
import { plural } from 'https://deno.land/x/deno_plural@2.0.0/mod.ts';


const [ model, basePath, moduleName ] = Deno.args;
const modelSnaked = paramCase(model);
const modelSnakedPlural = paramCase(plural(model));
const moduleNameSnaked = moduleName ? paramCase(moduleName) : '';

console.log({ model, basePath, modelSnaked, modelSnakedPlural, moduleName, moduleNameSnaked });


const baseDirectory = `${basePath}/${modelSnakedPlural}`;

const interfacesFile = `${baseDirectory}/interfaces.d.ts`;
const resourceFile = `${baseDirectory}/resource.ts`;
const modelFile = `${baseDirectory}/model.ts`;
const controllerFile = `${baseDirectory}/controller.ts`;
const routerFile = `${baseDirectory}/router.ts`;


const interfacesContent = (
`import { IResourceBase } from 'resource-maker';


export interface I${model}Base {
  name: string;
} export interface I${model} extends I${model}Base, IResourceBase {}
`);

const resourceContent = (
`import { SettingResourceMaker } from 'setting-resource-maker';
import { I${model}Base, I${model} } from './interfaces.d.ts';


export const ${model}Maker = new SettingResourceMaker<I${model}Base, I${model}>('${model}');
`);

const modelContent = (
`import { ${model}Maker } from './resource.ts';


${model}Maker.setProperties({
  name: {
    type: 'string',
    required: true,
    title: 'نام',
    titleable: true
  }
});


${model}Maker.makeModel();
`);

const controllerContent = (
`import { ${model}Maker } from './resource.ts';
import './model.ts';


export const ${model}Controller = ${model}Maker.getController();


${model}Maker.addValidations({ });
`);

const routerContent = (
`import { ${model}Maker } from './resource.ts';
import './controller.ts';


${model}Maker.addActions({
  'retrieve': {
    ...${model}Maker.getRetrieveRoute(),
    permission: 'admin${moduleNameSnaked ? `.${moduleNameSnaked}` : ''}.${modelSnaked}.retrieve'
  },
  'update': {
    ...${model}Maker.getUpdateRoute(),
    permission: 'admin${moduleNameSnaked ? `.${moduleNameSnaked}` : ''}.${modelSnaked}.update'
  }
});


export const ${model}Router = ${model}Maker.getRouter();
`);


await ensureFile(interfacesFile);
await ensureFile(resourceFile);
await ensureFile(modelFile);
await ensureFile(controllerFile);
await ensureFile(routerFile);

await Deno.writeTextFile(interfacesFile, interfacesContent);
await Deno.writeTextFile(resourceFile, resourceContent);
await Deno.writeTextFile(modelFile, modelContent);
await Deno.writeTextFile(controllerFile, controllerContent);
await Deno.writeTextFile(routerFile, routerContent);
