import { Controller, Get } from '@nestjs/common';
import { {{pascalCase}}Service } from './{{kebabCase}}.service';

@Controller('{{kebabCase}}')
export class {{pascalCase}}Controller {
  constructor(private readonly {{pascalCase}}Servie: {{pascalCase}}Service) {}

}
