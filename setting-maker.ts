import { dash, camel } from 'npm:radash@12.1.0';
import pluralize from 'npm:pluralize@8.0.0';
import { ensureFile } from 'jsr:@std/fs@0.229.2';


const [ model, basePath, moduleName ] = Deno.args;


const directoryPath = `${basePath ? basePath : './'}${moduleName ? (dash(moduleName) + '/') : ('')}`;
const filePath = `${directoryPath}${dash(pluralize(model))}.ts`;

await ensureFile(filePath);


const fileContent = `
import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedSettingController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedSettingController } from 'unified-resources';


interface I${model}Base {
  name?: string;
} export interface I${model} extends I${model}Base, IBaseDocument {}

const ${model}Schema: IUnifiedModel<I${model}Base> = {
  name: {
    type: 'string',
  },
};


declare module 'unified-app' {
  interface IUnifiedApp {
    ${camel(pluralize(model))}: IUnifiedSettingController<I${model}Base>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('${model}', ${model}Schema);

  app.${camel(pluralize(model))} = createUnifiedSettingController<I${model}Base>(app, '${model}', ${model}Schema);


  app.addActions({
    'meta': {
      method: 'get',
      path: '/${dash(pluralize(model))}/meta',
      requirePermission: 'admin.${moduleName ? (dash(moduleName) + '.') : ''}${dash(pluralize(model))}.meta',
      handler: () => {
        return app.models['${model}'];
      },
    },
    'retrieve': {
      method: 'get',
      path: '/${dash(pluralize(model))}/',
      handler: ({ filter, populate, select }) => {
        return app.${camel(pluralize(model))}.retrieve({
          filter,
          populate,
          select,
        });
      },
    },
    'update': {
      method: 'patch',
      path: '/${dash(pluralize(model))}/',
      requirePermission: 'admin.${moduleName ? (dash(moduleName) + '.') : ''}${dash(pluralize(model))}.update',
      handler: ({ filter, body }) => {
        return app.${camel(pluralize(model))}.update({
          filter,
          payload: body,
        });
      },
    },
  });

}
`;

await Deno.writeTextFile(filePath, fileContent.slice(1));


console.log(`${filePath} created successfully!`);
