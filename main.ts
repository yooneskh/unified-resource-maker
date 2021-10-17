import { ensureFile } from 'https://deno.land/std@0.106.0/fs/mod.ts';
import { paramCase } from 'https://deno.land/x/case@v2.1.0/mod.ts';
import { plural } from 'https://deno.land/x/deno_plural@1.0.1/mod.ts';


const [ model, basePath, depthArg ] = Deno.args;
const modelSnaked = paramCase(model);
const modelSnakedPlural = paramCase(plural(model));
const depthNumber = parseInt(depthArg, 10) || 2;
const depthNormalizer = '../'.repeat(depthNumber);

console.log({ model, basePath, modelSnaked, modelSnakedPlural, depthNumber, depthNormalizer });


const baseDirectory = `${basePath}/${modelSnakedPlural}`;

const interfacesFile = `${baseDirectory}/${modelSnakedPlural}-interfaces.d.ts`;
const resourceFile = `${baseDirectory}/${modelSnakedPlural}-resource.ts`;
const modelFile = `${baseDirectory}/${modelSnakedPlural}-model.ts`;
const controllerFile = `${baseDirectory}/${modelSnakedPlural}-controller.ts`;
const routerFile = `${baseDirectory}/${modelSnakedPlural}-router.ts`;


const interfacesContent = (
`import { IResourceBase } from '${depthNormalizer}plugins/resource-maker/resource-model.d.ts';


export interface I${model}Base {
  name: string;
} export interface I${model} extends I${model}Base, IResourceBase {}
`);

const resourceContent = (
`import { ResourceMaker } from '${depthNormalizer}plugins/resource-maker/resource-maker.ts';
import { I${model}Base, I${model} } from './${modelSnakedPlural}-interfaces.d.ts';


export const ${model}Maker = new ResourceMaker<I${model}Base, I${model}>('${model}');
`);

const modelContent = (
`import { ${model}Maker } from './${modelSnakedPlural}-resource.ts';


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
`import { ${model}Maker } from './${modelSnakedPlural}-resource.ts';
import './${modelSnakedPlural}-model.ts';


export const ${model}Controller = ${model}Maker.getController();
`);

const routerContent = (
`import { ${model}Maker } from './${modelSnakedPlural}-resource.ts';
import './${modelSnakedPlural}-controller.ts';


${model}Maker.addActions({
  'list': {
    template: 'list',
    permission: 'admin.${modelSnaked}.list'
  },
  'count': {
    template: 'count',
    permission: 'admin.${modelSnaked}.count'
  },
  'retrieve': {
    template: 'retrieve',
    permission: 'admin.${modelSnaked}.retrieve'
  },
  'create': {
    template: 'create',
    permission: 'admin.${modelSnaked}.create'
  },
  'update': {
    template: 'update',
    permission: 'admin.${modelSnaked}.update'
  },
  'delete': {
    template: 'delete',
    permission: 'admin.${modelSnaked}.delete'
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
