import * as fs from 'fs-extra';
import { IComponentScope } from './component';
import { FileBase, IResolver } from './file';

export interface LicenseOptions {
  /**
   * Copyright owner
   *
   * @default ""
   */
  readonly copyrightOwner?: string;

  /**
   * Period of license (e.g. "1998-2023")
   *
   * @default - current year (e.g. "2020")
   */
  readonly copyrightPeriod?: string;
}

export class License extends FileBase {
  private readonly text: string;

  constructor(project: IComponentScope, spdx: string, options: LicenseOptions) {
    super(project, 'LICENSE');

    const textFile = `${__dirname}/../license-text/${spdx}.txt`;
    if (!fs.existsSync(textFile)) {
      throw new Error(`unsupported license ${spdx}`);
    }

    const years = options.copyrightPeriod ?? new Date().getFullYear().toString();
    const owner = options.copyrightOwner ?? '';

    this.text = fs.readFileSync(textFile, 'utf-8')
      .replace('[yyyy]', years)
      .replace('[name of copyright owner]', owner);
  }

  protected synthesizeContent(_: IResolver) {
    return this.text;
  }
}