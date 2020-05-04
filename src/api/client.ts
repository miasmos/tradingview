/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */

import axios, { AxiosPromise, AxiosResponse } from "axios";
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
    params?: unknown;
    isCached?: boolean;
    form?: unknown;
}

class TradingViewClient {
    static client = axios.create({
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

    static cookies = TradingViewClient.getCookies();

    static async get<T>({
        subdomain,
        path,
        params,
        form,
        isCached = false
    }: GetOptions): Promise<T> {
        const callback = TradingViewClient.client.get.bind(
            TradingViewClient.client,
            `https://${subdomain}.${HOSTNAME}${path}`,
            {
                params,
                headers: {
                    authority: `${subdomain}.${HOSTNAME}`,
                    cookie: TradingViewClient.cookies,
                    ...(isCached && {
                        "if-modified-since": DateTime.local().toHTTP(),
                        "if-none-match": `W/${etag(Math.random().toString())}`
                    })
                },
                data: form
            }
        );
        const data = await TradingViewClient.resolve<T>(callback);
        return data;
    }

    static async resolve<T>(callback: () => AxiosPromise): Promise<T> {
        const { data, status } = (await callback()) as AxiosResponse<T>;
        if (status !== 200) {
            throw new Error(`Got status code ${status}`);
        }
        return data as T;
    }

    static getCookies(): string {
        const id = uuid.v4();
        return Object.entries({
            png: id,
            etg: id,
            cachec: id,
            tv_ecuid: id,
            [`_sp_id.${Util.randomHex(4)}`]: `${uuid.v4()}.${Util.randomInt(10)}.${Util.randomInt(
                2
            )}.${Util.randomInt(10)}.${Util.randomInt(10)}.${uuid.v4()}`
        }).reduce((previous, [key, value]) => `${previous}${key}=${value};`, "");
    }
}

TradingViewClient.client.interceptors.request.use(({ method, headers, url, params, ...config }) => {
    console.log(`${method!.toUpperCase()} ${url}?${new URLSearchParams(params).toString()}`);
    // console.log(JSON.stringify(headers, undefined, 2));
    return {
        method,
        headers,
        url,
        params,
        ...config
    };
});

export default TradingViewClient;
