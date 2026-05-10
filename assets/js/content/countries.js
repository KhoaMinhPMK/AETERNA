/**
 * countries.js
 * Data for all 11 ASEAN nations in AETERNA.
 * Story content sourced from "1. VIỆT NAM CHIỀU KHÔNG GIAN CỦA HƠI THỞ VÀ MẠCH RỒNG.md"
 */
import { t } from '../i18n/i18n.js';

export function getCountries() {
  return [
    {
      id: 'vietnam',
      serial: '01',
      name: t('countries.vietnam.name'),
      realm: t('countries.vietnam.realm'),
      story: t('countries.vietnam.story'),
      image: 'assets/media/images/backgrounds/vietnam.png',
    },
    {
      id: 'thailand',
      serial: '02',
      name: t('countries.thailand.name'),
      realm: t('countries.thailand.realm'),
      story: t('countries.thailand.story'),
      image: 'assets/media/images/backgrounds/thailand.png',
    },
    {
      id: 'cambodia',
      serial: '03',
      name: t('countries.cambodia.name'),
      realm: t('countries.cambodia.realm'),
      story: t('countries.cambodia.story'),
      image: 'assets/media/images/backgrounds/cambodia.png',
    },
    {
      id: 'indonesia',
      serial: '04',
      name: t('countries.indonesia.name'),
      realm: t('countries.indonesia.realm'),
      story: t('countries.indonesia.story'),
      image: 'assets/media/images/backgrounds/indonesia.png',
    },
    {
      id: 'philippines',
      serial: '05',
      name: t('countries.philippines.name'),
      realm: t('countries.philippines.realm'),
      story: t('countries.philippines.story'),
      image: 'assets/media/images/backgrounds/philipines.png',
    },
    {
      id: 'malaysia',
      serial: '06',
      name: t('countries.malaysia.name'),
      realm: t('countries.malaysia.realm'),
      story: t('countries.malaysia.story'),
      image: 'assets/media/images/backgrounds/malaysia.png',
    },
    {
      id: 'singapore',
      serial: '07',
      name: t('countries.singapore.name'),
      realm: t('countries.singapore.realm'),
      story: t('countries.singapore.story'),
      image: 'assets/media/images/backgrounds/singapore.png',
    },
    {
      id: 'myanmar',
      serial: '08',
      name: t('countries.myanmar.name'),
      realm: t('countries.myanmar.realm'),
      story: t('countries.myanmar.story'),
      image: 'assets/media/images/backgrounds/myanmar.png',
    },
    {
      id: 'laos',
      serial: '09',
      name: t('countries.laos.name'),
      realm: t('countries.laos.realm'),
      story: t('countries.laos.story'),
      image: 'assets/media/images/backgrounds/laooo.png',
    },
    {
      id: 'brunei',
      serial: '10',
      name: t('countries.brunei.name'),
      realm: t('countries.brunei.realm'),
      story: t('countries.brunei.story'),
      image: 'assets/media/images/backgrounds/brunei.png',
    },
    {
      id: 'timor-leste',
      serial: '11',
      name: t('countries.timorLeste.name'),
      realm: t('countries.timorLeste.realm'),
      story: t('countries.timorLeste.story'),
      image: 'assets/media/images/backgrounds/timor-leste.png',
    },
  ];
}
