import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { fetchContacts } from "../utility/api";
import ContactThumbnail from "../components/ContactThumbnail";
import { NavigationProp } from "@react-navigation/native";

const keyExtractor = ({ phone }: { phone: string }) => phone;

export default function FavoritesScreen({
	navigation,
}: {
	navigation: NavigationProp<any>;
}) {
	const [contacts, setContacts] = useState<
		{ avatar: string; favorite: boolean; phone: string }[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		// Subscribe to navigation focus and refresh the favorites when the screen is focused
		const unsubscribe = navigation.addListener("focus", () => {
			fetchAndSetFavorites();
		});

		// Fetch contacts on mount
		fetchAndSetFavorites();

		return unsubscribe;
	}, []);

	const fetchAndSetFavorites = () => {
		setLoading(true);
		setError(false);

		fetchContacts()
			.then((contacts) => {
				// Filter only favorite contacts
				const favorites = contacts.filter(
					(contact: { phone: string; favorite: any; }) =>
						globalThis.favoriteContacts.has(contact.phone) && contact.favorite
				);
				setContacts(favorites);
				setLoading(false);
			})
			.catch((e) => {
				setLoading(false);
				setError(true);
			});
	};

	const renderFavoriteThumbnail = ({
		item,
	}: {
		item: { avatar: string; [key: string]: any };
	}) => {
		const { avatar } = item;
		return (
			<ContactThumbnail
				avatar={avatar}
				onPress={() => navigation.navigate("Profile", { contact: item })}
				name={""}
				phone={""}
				textColor={""}
			/>
		);
	};

	return (
		<View style={styles.container}>
			{loading && (
				<ActivityIndicator
					color={"blue"}
					size={"large"}
					style={styles.loadingIndicator}
				/>
			)}
			{error && <Text>Error...</Text>}
			{!loading && !error && (
				<FlatList
					data={contacts}
					keyExtractor={keyExtractor}
					numColumns={3}
					contentContainerStyle={styles.list}
					renderItem={renderFavoriteThumbnail}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		justifyContent: "center",
		flex: 1,
	},
	list: {
		alignItems: "center",
	},
	loadingIndicator: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
