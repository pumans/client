export interface SubMenuItem {
  name: string;
  link: string;
}

export interface MenuItem {
  name: string;
  link: string;
  subItems?: SubMenuItem[];
}
