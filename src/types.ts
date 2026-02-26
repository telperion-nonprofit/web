export interface MenuItem {
  name: string;
  url: string;
  subItems?: MenuItem[];
}
