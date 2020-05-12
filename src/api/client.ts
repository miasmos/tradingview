/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */

import axios, { AxiosPromise, AxiosResponse } from "axios";
import FormData from "form-data";
import { URLSearchParams } from "url";

import ua = require("random-useragent");
import etag = require("etag");
import uuid = require("uuid");
import { DateTime } from "luxon";
import { Subdomain } from "../enum";
import { HOSTNAME } from "../constants";
import Util from "../util";

interface GetOptions {
    subdomain?: Subdomain;
    path: string;
    params?: { [key: string]: string | number | undefined };
    isCached?: boolean;
    form?: unknown;
}

interface PostOptions {
    subdomain?: Subdomain;
    path: string;
    params?: { [key: string]: string | number };
    isCached?: boolean;
    form?: { [key: string]: string | number };
}

class TradingViewClient {
    client = axios.create({
        headers: {
            "user-agent": ua.getRandom(
                ({ browserName }) =>
                    browserName === "Chrome" ||
                    browserName === "Firefox" ||
                    browserName === "Safari"
            ),
            dnt: 1,
            accept: "*/*",
            origin: `https://www.${HOSTNAME}`,
            "sec-fetch-site": "same-site",
            "sec-fetch-mode": "cors",
            "sec-fetch-dest": "empty",
            referer: `https://www.${HOSTNAME}/`,
            "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,fr;q=0.7"
        }
    });

    cookies = this.getCookies();

    sessionId: string;

    async get<T>({
        subdomain = Subdomain.Root,
        path,
        params,
        form,
        isCached = false
    }: GetOptions): Promise<T> {
        const { png, etg, cachec, tv_ecuid, backend, ...cookies } = this.cookies;
        const callback = this.client.get.bind(
            this.client,
            `https://${subdomain}.${HOSTNAME}${path}`,
            {
                params,
                headers: {
                    cookie: Util.serializeCookies({
                        backend,
                        ...cookies,
                        ...(this.sessionId && {
                            png,
                            etg,
                            cachec,
                            tv_ecuid,
                            sessionid: this.sessionId
                        })
                    }),
                    ...(isCached && {
                        "if-modified-since": DateTime.local().toHTTP(),
                        "if-none-match": `W/${etag(Math.random().toString())}`
                    })
                },
                data: form
            }
        );
        const response = await this.resolve<T>(callback);
        return response;
    }

    async post<T>({
        subdomain = Subdomain.Root,
        path,
        params,
        form,
        isCached = false
    }: PostOptions): Promise<T> {
        let data;
        if (form) {
            data = Object.entries(form).reduce((form, [key, value]) => {
                form.append(key, value);
                return form;
            }, new FormData());
        }

        const { png, etg, cachec, tv_ecuid, backend, ...cookies } = this.cookies;
        const callback = this.client.post.bind(
            this.client,
            `https://${subdomain}.${HOSTNAME}${path}`,
            data,
            {
                params,
                headers: {
                    cookie: Util.serializeCookies({
                        backend,
                        ...cookies,
                        ...(this.sessionId && {
                            png,
                            etg,
                            cachec,
                            tv_ecuid,
                            sessionid: this.sessionId
                        })
                    }),
                    ...(isCached && {
                        "if-modified-since": DateTime.local().toHTTP(),
                        "if-none-match": `W/${etag(Math.random().toString())}`
                    }),
                    ...(data && data.getHeaders())
                }
            }
        );
        const response = await this.resolve<T>(callback);
        return response;
    }

    async resolve<T>(callback: () => AxiosPromise): Promise<T> {
        const { data, status, headers } = (await callback()) as AxiosResponse<T>;
        if (status !== 200) {
            throw new Error(`Got status code ${status}`);
        }
        const { "set-cookie": setCookie } = headers;
        if (setCookie) {
            const { sessionid } = setCookie.reduce(
                (obj: { [key: string]: string | undefined }, entry: string) => {
                    entry
                        .split("; ")
                        .map((inner: string) => inner.split("="))
                        .forEach(([key, value]) => {
                            obj[key] = value;
                        });
                    return obj;
                },
                {}
            );

            if (sessionid) {
                this.sessionId = sessionid;
                Util.log(`Logged in with session id ${sessionid}`);
            }
        }
        return data as T;
    }

    getCookies(): { [key: string]: string | number } {
        const id = uuid.v4();
        return {
            png: id,
            etg: id,
            cachec: id,
            tv_ecuid: id,
            backend: "prod_backend",
            [`_sp_id.${Util.randomHex(4)}`]: `${uuid.v4()}.${Util.randomInt(10)}.${Util.randomInt(
                2
            )}.${Util.randomInt(10)}.${Util.randomInt(10)}.${uuid.v4()}`
        };
    }
}

const tradingViewClient = new TradingViewClient();
tradingViewClient.client.interceptors.request.use(({ method, headers, url, params, ...config }) => {
    Util.log(
        `${method!.toUpperCase()} ${url}${
            params ? `?${new URLSearchParams(params).toString()}` : ""
        }`
    );
    return {
        method,
        headers,
        url,
        params,
        ...config
    };
});

export default tradingViewClient;
