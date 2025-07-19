import { get, Step } from 'grafast';

/**
 * Returns a "plantime only step" that will optimize away to be simply
 * `$primary` at runtime; but during planning if you `.get(...)` any of the
 * attributes listed in `delegatedAttributes` they will be sourced from
 * `$secondary` rather than `$primary`. Useful if your data is split across two
 * objects, e.g. a shared object for all "animal" types and then a specific
 * object for the properties only relevant to a "cat".
 */
export function delegate($primary: Step, delegatedAttributes: string[], $secondary: Step) {
  return new DelegateStep($primary, delegatedAttributes, $secondary);
}

class DelegateStep extends Step {
  // Don't export
  static override $$export = null;
  constructor(
    $primary: Step,
    private delegatedAttributes: string[],
    $secondary: Step,
  ) {
    super();
    this.addStrongDependency($primary);
    this.addStrongDependency($secondary);
  }
  get(attr: string) {
    if (this.delegatedAttributes.includes(attr)) {
      return get(this.getDep(1), attr);
    }
    return get(this.getDep(0), attr);
  }
  override optimize() {
    return this.getDep(0);
  }
}
