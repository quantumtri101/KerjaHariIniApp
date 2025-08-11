import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Base from "../utils/base";

const useFetch = (method, endpoint, query = {}, isAutoRun = true) => {
	var base = new Base()
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	// const [tempToken, setTempToken] = useState(null);
	// const [token, setToken] = useState(null);

	const findAsyncStorageToken = async () => {
		var getAsyncToken = await AsyncStorage.getItem("token");
		var getAsyncTempToken = await AsyncStorage.getItem("tempToken");
		// console.log("getAsyncToken", getAsyncToken);
		// console.log("getAsyncTempToken", getAsyncTempToken);
		// setToken(getAsyncToken);
		// setTempToken(getAsyncTempToken);
	};

	const options = {
		method: method,
		url: `${base.host}/api/${endpoint}`,
		headers: {
			"Content-Type": "application/json", //contentType
			Accept: "application/json", //Accept\
			Authorization: AsyncStorage.getItem("token"),
			// Authorization: token === null ? tempToken : token,
		},
		data: { ...query },
	};

	const setStaticToken = async () => {
		await AsyncStorage.setItem("token", "Bearer 96|fAP6zrw6JLoqAXjdfK7BfUiOJUOpe5HL5i9JVZhR");
	};

	const fetchData = async () => {
		// console.log(`${base.host}/api/${endpoint}`)
		// console.log(await AsyncStorage.getItem("token"))

		setIsLoading(true);
		var getAsyncToken = await AsyncStorage.getItem("token");
		var getAsyncTempToken = await AsyncStorage.getItem("tempToken");
		// console.log(options);
		options.headers["Authorization"] = getAsyncToken != null ? getAsyncToken : getAsyncTempToken;

		try {
			console.log(options.url)
			console.log(options.data)
			console.log(options.headers['Authorization'])

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
			console.log(options)

			// const response = await axios(options);
			console.log(response.data)
			setIsLoading(false);
			setData(response.data);
		} catch (error) {
			setIsLoading(false);
			console.log("Error Message", error.response.data.message);
		}
	};

	useEffect(() => {
		// setStaticToken()
		// findAsyncStorageToken();
		if (method == "GET" && isAutoRun)
			fetchData();
	}, []);

	const refetch = async (page = null, search = null) => {
		if (page != null) options.url += (options.url.includes("?") ? "&" : "?") + "page=" + page;
		if (search != null) options.url += (options.url.includes("?") ? "&" : "?") + "search=" + search;
		// options.params = body
		await fetchData();
	};

	const setRefetch = async (body = null) => {
		if(body != null)
			options.data = body;
		await fetchData();
	};

	const setFetchUrl = async (url) => {
		options.url = `${base.host}/api/${url}`;
		// await fetchData();
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
