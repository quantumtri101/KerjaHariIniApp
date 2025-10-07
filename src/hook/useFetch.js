import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Base from "../utils/base";

const useFetch = (method, endpoint, query = {}, isAutoRun = true) => {
	var base = new Base()
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const options = {
		method: method,
		url: `${base.host}/api/${endpoint}`,
		headers: {
			"Content-Type": "application/json", //contentType
			Accept: "application/json", //Accept\
			Authorization: AsyncStorage.getItem("token"),
		},
		data: { ...query },
	};

	const fetchData = async () => {

		setIsLoading(true);
		var getAsyncToken = await AsyncStorage.getItem("token");
		var getAsyncTempToken = await AsyncStorage.getItem("tempToken");
		options.headers["Authorization"] = getAsyncToken != null ? getAsyncToken : getAsyncTempToken;

		try {

			var response = null
			if(options.method == "GET")
				response = await axios.get(options.url, {
					headers: options.headers,
				});
			else if(options.method == "POST")
				response = await axios.post(options.url, options.data, {
					headers: options.headers,
				});
			else if(options.method == "PUT")
				response = await axios.put(options.url, options.data, {
					headers: options.headers,
				});
			else if(options.method == "DELETE")
				response = await axios.post(options.url, {
					headers: options.headers,
				});

			setIsLoading(false);
			setData(response.data);
		} catch (error) {
			setIsLoading(false);
			console.log("Error Message", error.response.data.message);
		}
	};

	useEffect(() => {
		if (method == "GET" && isAutoRun)
			fetchData();
	}, []);

	const refetch = async (page = null, search = null) => {
		if (page != null) options.url += (options.url.includes("?") ? "&" : "?") + "page=" + page;
		if (search != null) options.url += (options.url.includes("?") ? "&" : "?") + "search=" + search;
		await fetchData();
	};

	const setRefetch = async (body = null) => {
		if(body != null)
			options.data = body;
		await fetchData();
	};

	const setFetchUrl = async (url) => {
		options.url = `${base.host}/api/${url}`;
	};

	const setFetchBody = async (body) => {
		setData(body)
		options.data = body
	};

	const consoleQuery = async () => {
		return console.log("useFetch Console Query :", query);
	};

	return { data, isLoading, error, refetch, fetchData, setRefetch, setFetchBody, setFetchUrl, consoleQuery };
};

export default useFetch;
