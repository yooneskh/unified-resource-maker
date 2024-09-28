import { dash, camel } from 'npm:radash@12.1.0';
import pluralize from 'npm:pluralize@8.0.0';
import { ensureFile } from 'jsr:@std/fs@0.229.2';


const [ model, basePath, moduleName ] = Deno.args;


const directoryPath = `${basePath ? basePath : './'}${moduleName ? (dash(moduleName) + '/') : ('')}${dash(pluralize(model))}`;
const filePath = `${directoryPath}/mod.ts`;

await ensureFile(filePath);


const fileContent = `
import type { IUnifiedApp } from 'unified-app';
import type { IUnifiedModel, IUnifiedController } from 'unified-resources';
import type { IBaseDocument } from 'unified-kv';
import { createUnifiedController } from 'unified-resources';


interface I${model}Base {
  name: string;
} export interface I${model} extends I${model}Base, IBaseDocument {}

const ${model}Schema: IUnifiedModel<I${model}Base> = {
  name: {
    type: 'string',
    required: true,
    titleable: true,
  },
};


declare module 'unified-app' {
  interface IUnifiedApp {
    ${camel(pluralize(model))}: IUnifiedController<I${model}Base>;
  }
}


export function install(app: IUnifiedApp) {

  app.addModel('${model}', ${model}Schema);

  app.${camel(pluralize(model))} = createUnifiedController<I${model}Base>(app, '${model}', ${model}Schema);


  app.addActions({
    'meta': {
      method: 'get',
      path: '/${dash(pluralize(model))}/meta',
      requirePermission: 'admin.${moduleName ? (dash(moduleName) + '.') : ''}${dash(pluralize(model))}.meta',
      handler: () => {
        return app.models['${model}'];
      },
    },
    'list': {
      template: 'list',
      controller: app.${camel(pluralize(model))},
      pathPrefix: '/${dash(pluralize(model))}',
      requirePermission: 'admin.${moduleName ? (dash(moduleName) + '.') : ''}${dash(pluralize(model))}.list',
    },
    'count': {
      template: 'count',
      controller: app.${camel(pluralize(model))},
      pathPrefix: '/${dash(pluralize(model))}',
      requirePermission: 'admin.${moduleName ? (dash(moduleName) + '.') : ''}${dash(pluralize(model))}.count',
    },
    'retrieve': {
      template: 'retrieve',
      controller: app.${camel(pluralize(model))},
      pathPrefix: '/${dash(pluralize(model))}',
      requirePermission: 'admin.${moduleName ? (dash(moduleName) + '.') : ''}${dash(pluralize(model))}.retrieve',
    },
    'create': {
      template: 'create',
      controller: app.${camel(pluralize(model))},
      pathPrefix: '/${dash(pluralize(model))}',
      requirePermission: 'admin.${moduleName ? (dash(moduleName) + '.') : ''}${dash(pluralize(model))}.create',
    },
    'update': {
      template: 'update',
      controller: app.${camel(pluralize(model))},
      pathPrefix: '/${dash(pluralize(model))}',
      requirePermission: 'admin.${moduleName ? (dash(moduleName) + '.') : ''}${dash(pluralize(model))}.update',
    },
    'replace': {
      template: 'replace',
      controller: app.${camel(pluralize(model))},
      pathPrefix: '/${dash(pluralize(model))}',
      requirePermission: 'admin.${moduleName ? (dash(moduleName) + '.') : ''}${dash(pluralize(model))}.replace',
    },
    'delete': {
      template: 'delete',
      controller: app.${camel(pluralize(model))},
      pathPrefix: '/${dash(pluralize(model))}',
      requirePermission: 'admin.${moduleName ? (dash(moduleName) + '.') : ''}${dash(pluralize(model))}.delete',
    },
  });

}
`;

await Deno.writeTextFile(filePath, fileContent.slice(1));


console.log(`${filePath} created successfully!`);