import { Module } from '@nestjs/common';
import { {{pascalCase}}Controller } from './{{kebabCase}}.controller';
import { {{pascalCase}}Service } from './{{kebabCase}}.service';

@Module({
  controllers: [{{pascalCase}}Controller],
  providers: [{{pascalCase}}Service],
})
export class {{pascalCase}}Module {}
