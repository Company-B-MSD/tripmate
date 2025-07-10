import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Changed from next/link
import { MoveRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const destinations = [
	{
		name: "Sigiriya",
		description: "Ascend the ancient rock fortress with breathtaking views.",
		image: "/destinations/Sigiriya/cover.jpg",
		aiHint: "Sigiriya rock",
		path: "/destinations/sigiriya", // Add this path
	},
	{
		name: "Weligama",
		description: "Enjoying the sea breeze with spellbinding memories",
		image: "/destinations/Weligama/cape.jpg",
		aiHint: "Weligama beach",
		path: "/destinations/weligama", // Add this path
	},
	{
		name: "Ella",
		description:
			"Explore lush tea plantations and stunning mountain landscapes.",
		image: "/destinations/Ella/cover.jpg",
		aiHint: "Ella SriLanka",
		path: "/destinations/ella", // Add this path
	},
	{
		name: "Mirissa",
		description: "Relax on golden beaches and go whale watching.",
		image: "/destinations/Mirissa/cover.jpg",
		aiHint: "Mirissa beach",
		path: "/destinations/mirissa", // Add this path
	},
	{
		name: "Colombo",
		description: "Colombo blends history, culture, and coastal charm in Sri Lanka.",
		image: "/destinations/Colombo/cover.jpg",
		aiHint: "colombo city",
		path: "/destinations/colombo", // Add this path
	},
	{
		name: "Kandy",
		description:
			"Visit the Temple of the Tooth Relic in this cultural heartland.",
		image: "/destinations/Kandy/cover.webp",
		aiHint: "Kandy temple",
		path: "/destinations/kandy", // Add this path
	},
	{
		name: "Yala",
		description:
			"Visit the nature life of Sri lanka, the pure lives of mother nature",
		image: "/destinations/Yala/lepcov.jpg",
		aiHint: "Yala park",
		path: "/destinations/yala", // Add this path
	},
	{
		name: "Polonnaruwa",
		description:
			"Journey through ancient Polonnaruwa's sacred grounds",
		image: "/destinations/Polonnaruwa/pol.png",
		aiHint: "Polonnaruwa",
		path: "/destinations/polonnaruwa", // Add this path
	},
];

export default function DestinationsSection() {
	const { isAuthenticated } = useAuth();

	return (
		<section
			id="destinations"
			className="w-full py-16 md:py-24 lg:py-32 bg-muted/50"
		>
			<div className="container mx-auto px-4 md:px-6">
				<div className="text-center space-y-4 mb-12">
					<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
						Explore Enchanting Sri Lanka
					</h2>
					<p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed">
						From ancient cities to pristine beaches, Sri Lanka offers
						diverse experiences.
					</p>
				</div>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{destinations.map((destination) => (
						<Card
							key={destination.name}
							className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
						>
							<a href={destination.path}>
							<div className="relative h-60 w-full">
								<img
									// Changed from next/image
									src={destination.image}
									alt={destination.name}
									className="group-hover:scale-105 transition-transform duration-300 object-cover w-full h-full" // Added object-cover, w-full, h-full
									data-ai-hint={destination.aiHint}
								/>
							</div>
							<CardContent className="p-4">
								<h3 className="text-xl font-semibold mb-1 text-foreground">
									{/* {destination.name} */}
									<a href={destination.path}>{destination.name}</a>
								</h3>
								<p className="text-sm text-muted-foreground">
									{destination.description}
								</p>
							</CardContent>
							<CardFooter className="p-4 pt-0">
								<Button
									variant="link"
									className="p-0 h-auto text-primary hover:text-accent"
									asChild
								>									
								
								<a href={destination.path}>Learn More</a>
								
								</Button>
							</CardFooter>
							</a>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
