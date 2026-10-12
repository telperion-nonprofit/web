import type { ImageMetadata } from "astro";
import type { TranslationKey } from "../i18n";
import jakubNekvasilPhoto from "../assets/team/jakub_nekvasil.jpg";
import damiaVeselaPhoto from "../assets/team/damia_vesela.jpg";
import annaZezulkaPhoto from "../assets/team/anna_zezulka.jpg";
import jolanaBalcarovaPhoto from "../assets/team/jolana_balcarova.jpg";
import mykhailoOvechkinPhoto from "../assets/team/mykhailo_ovechkin.jpg";
import davidBartosPhoto from "../assets/team/david_bartos.jpg";
import valeriiaTsyhanchukPhoto from "../assets/team/valeriia_tsyhanchuk.jpg";
import klaraBodlakovaPhoto from "../assets/team/klara_bodlakova.jpg";
import stellaTomanovaPhoto from "../assets/team/stella_tomanova.jpg";
import karolinaCiencialovaPhoto from "../assets/team/karolina_ciencialova.jpg";

export interface TeamMember {
  name: string;
  roleKey: TranslationKey;
  email: string;
  phone?: string;
  // Members without a photo get a generic avatar.
  image?: ImageMetadata;
}

export const leadership: TeamMember[] = [
  {
    name: "Jakub Nekvasil",
    roleKey: "team.jakub_nekvasil.role",
    email: "jakub.nekvasil@telperion.cz",
    phone: "+420 776 059 998",
    image: jakubNekvasilPhoto,
  },
  {
    name: "Damia Veselá",
    roleKey: "team.damia_vesela.role",
    email: "damia.vesela@telperion.cz",
    phone: "+420 608 168 078",
    image: damiaVeselaPhoto,
  },
  {
    name: "Anna Zezulka",
    roleKey: "team.anna_zezulka.role",
    email: "anna.zezulka@telperion.cz",
    image: annaZezulkaPhoto,
  },
  {
    name: "Jolana Balcarová",
    roleKey: "team.jolana_balcarova.role",
    email: "jolana.balcarova@telperion.cz",
    image: jolanaBalcarovaPhoto,
  },
  {
    name: "Mykhailo Ovechkin",
    roleKey: "team.mykhailo_ovechkin.role",
    email: "mykhailo.ovechkin@telperion.cz",
    image: mykhailoOvechkinPhoto,
  },
];

export const members: TeamMember[] = [
  {
    name: "David Bartoš",
    roleKey: "team.david_bartos.role",
    email: "david.bartos@telperion.cz",
    image: davidBartosPhoto,
  },
  {
    name: "Valeriia Tsyhanchuk",
    roleKey: "team.valeriia_tsyhanchuk.role",
    email: "valeriia.tsyhanchuk@telperion.cz",
    image: valeriiaTsyhanchukPhoto,
  },
  {
    name: "Klára Bodláková",
    roleKey: "team.klara_bodlakova.role",
    email: "klara.bodlakova@telperion.cz",
    image: klaraBodlakovaPhoto,
  },
  {
    name: "Stella Tomanová",
    roleKey: "team.stella_tomanova.role",
    email: "stella.tomanova@telperion.cz",
    image: stellaTomanovaPhoto,
  },
  {
    name: "Karolína Ciencialová",
    roleKey: "team.karolina_ciencialova.role",
    email: "karolina.ciencialova@telperion.cz",
    image: karolinaCiencialovaPhoto,
  },
  {
    name: "Sofia Grycová",
    roleKey: "team.sofia_grycova.role",
    email: "sofia.grycova@telperion.cz",
  },
  {
    name: "Hana Trinh",
    roleKey: "team.hana_trinh.role",
    email: "hana.trinh@telperion.cz",
  },
  {
    name: "Klára Adámková",
    roleKey: "team.klara_adamkova.role",
    email: "klara.adamkova@telperion.cz",
  },
];
