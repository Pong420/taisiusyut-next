import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const repositoryUrl = publicRuntimeConfig.repositoryUrl;
