import { ensureDir, ensureFile } from 'https://deno.land/std@0.106.0/fs/mod.ts';
import { paramCase } from 'https://deno.land/x/case@v2.1.0/mod.ts';


const [ model, basePath ] = Deno.args;
const modelSnaked = paramCase(model);
const depthNumber = parseInt(Deno.args[2], 10) || 3;
const depthNormalizer = '../'.repeat(depthNumber);

console.log({ model, basePath, modelSnaked, depthNormalizer });


const baseDirectory = `${basePath}/${modelSnaked}`;

const interfacesFile = `${baseDirectory}/${modelSnaked}-interfaces.d.ts`;
const resourceFile = `${baseDirectory}/${modelSnaked}-resource.ts`;
const modelFile = `${baseDirectory}/${modelSnaked}-model.ts`;
const controllerFile = `${baseDirectory}/${modelSnaked}-controller.ts`;
const routerFile = `${baseDirectory}/${modelSnaked}-router.ts`;


const interfacesContent = `import { Document } from 'mongoose';
import { IResource } from '${depthNormalizer}plugins/resource-maker/resource-model-types';


export interface I${model}Base extends IResource {

} export interface I${model} extends I${model}Base, Document {}
`;

const resourceContent = `import { ResourceMaker } from '${depthNormalizer}plugins/resource-maker/resource-maker';
import { I${model}, I${model}Base } from './${modelSnaked}-interfaces';


export const ${model}Maker = new ResourceMaker<I${model}Base, I${model}>('${model}');
`;

const modelContent = `import { ${model}Maker } from './${modelSnaked}-resource';


${model}Maker.addProperties([
  {
    key: 'name',
    type: 'string',
    required: true,
    title: 'نام',
    titleable: true
  }
]);


export const ${model}Model = ${model}Maker.getModel();
`;

const controllerContent = `import { ${model}Maker } from './${modelSnaked}-resource';
import './${modelSnaked}-model';


export const ${model}Controller = ${model}Maker.getController();


${model}Maker.setValidations({ });
`;

const routerContent = `import { ${model}Maker } from './${modelSnaked}-resource';
import './${modelSnaked}-controller';


${model}Maker.addActions([
  {
    template: 'LIST',
    permissions: ['admin.${modelSnaked}.list']
  },
  {
    template: 'LIST_COUNT',
    permissions: ['admin.${modelSnaked}.list-count']
  },
  {
    template: 'RETRIEVE',
    permissions: ['admin.${modelSnaked}.retrieve']
  },
  {
    template: 'CREATE',
    permissions: ['admin.${modelSnaked}.create']
  },
  {
    template: 'UPDATE',
    permissions: ['admin.${modelSnaked}.update']
  },
  {
    template: 'DELETE',
    permissions: ['admin.${modelSnaked}.delete']
  }
]);


export const ${model}Router = ${model}Maker.getRouter();
`;


await ensureDir(baseDirectory);
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
