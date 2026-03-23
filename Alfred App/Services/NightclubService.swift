//
//  NightclubService.swift
//  Alfred App
//
//  Nightclub service for database operations
//

import Foundation
import PostgREST

enum NightclubServiceError: LocalizedError {
    case databaseError(String)
    case unknownError
    
    var errorDescription: String? {
        switch self {
        case .databaseError(let message):
            return "Database error: \(message)"
        case .unknownError:
            return "An unknown error occurred"
        }
    }
}

class NightclubService {
    private var supabase: SupabaseManager {
        SupabaseManager.shared
    }
    
    private static let listColumns = "id,name,city,category,hero_image_url,rating,tags,is_featured,is_partner,music,address,vibe,price_level,entry_type,logo_url,dress_code,crowd_type,best_night,capacity,reservation,age_policy,opening_hours"
    
    // Get featured nightclubs
    @MainActor
    func getFeaturedNightclubs(city: String? = nil) async throws -> [Nightclub] {
        do {
            var query = supabase.database
                .from("nightclubs")
                .select(Self.listColumns)
                .eq("is_active", value: true)
                .eq("is_featured", value: true)
            
            if let city = city {
                query = query.eq("city", value: city)
            }
            
            let response: [Nightclub] = try await query
                .order("rating", ascending: false)
                .limit(8)
                .execute()
                .value
            
            #if DEBUG
            print("✅ Fetched \(response.count) featured nightclubs")
            #endif
            return response
        } catch {
            #if DEBUG
            print("❌ Error fetching featured nightclubs: \(error)")
            #endif
            throw NightclubServiceError.databaseError(error.localizedDescription)
        }
    }
    
    static let pageSize = 20
    
    // Get nightclubs/bars by city with optional filters (supports pagination)
    @MainActor
    func getNightclubs(city: String? = nil, filters: NightclubFilters? = nil, page: Int = 0) async throws -> [Nightclub] {
        do {
            var query = supabase.database
                .from("nightclubs")
                .select(Self.listColumns)
                .eq("is_active", value: true)
            
            if let city = city {
                query = query.eq("city", value: city)
            }
            
            // Apply filters if provided
            if let filters = filters {
                // Venue type filter (maps to category column)
                if let venues = filters.venues, !venues.isEmpty {
                    if venues.count == 1 {
                        query = query.ilike("category", pattern: "%\(venues[0])%")
                    } else {
                        let venueConditions = venues.map { "category.ilike.%\($0)%" }.joined(separator: ",")
                        query = query.or(venueConditions)
                    }
                    #if DEBUG
                    print("🔍 DEBUG: Applied venue filter: \(venues)")
                    #endif
                }
                
                // Music filter
                if let music = filters.music, !music.isEmpty {
                    if music.count == 1 {
                        query = query.ilike("music", pattern: "%\(music[0])%")
                    } else {
                        let musicConditions = music.map { "music.ilike.%\($0)%" }.joined(separator: ",")
                        query = query.or(musicConditions)
                    }
                    #if DEBUG
                    print("🔍 DEBUG: Applied music filter: \(music)")
                    #endif
                }
                
                // Vibe filter
                if let vibes = filters.vibes, !vibes.isEmpty {
                    if vibes.count == 1 {
                        query = query.ilike("vibe", pattern: "%\(vibes[0])%")
                    } else {
                        let vibeConditions = vibes.map { "vibe.ilike.%\($0)%" }.joined(separator: ",")
                        query = query.or(vibeConditions)
                    }
                    #if DEBUG
                    print("🔍 DEBUG: Applied vibe filter: \(vibes)")
                    #endif
                }
                
                // Price level filter
                if let priceLevels = filters.priceLevels, !priceLevels.isEmpty {
                    if priceLevels.count == 1 {
                        query = query.eq("price_level", value: priceLevels[0])
                    } else {
                        query = query.in("price_level", values: priceLevels)
                    }
                    #if DEBUG
                    print("🔍 DEBUG: Applied price level filter: \(priceLevels)")
                    #endif
                }
                
                // Entry type filter
                if let entryTypes = filters.entryTypes, !entryTypes.isEmpty {
                    if entryTypes.count == 1 {
                        query = query.ilike("entry_type", pattern: "%\(entryTypes[0])%")
                    } else {
                        let entryTypeConditions = entryTypes.map { "entry_type.ilike.%\($0)%" }.joined(separator: ",")
                        query = query.or(entryTypeConditions)
                    }
                    #if DEBUG
                    print("🔍 DEBUG: Applied entry type filter: \(entryTypes)")
                    #endif
                }
            }
            
            let from = page * Self.pageSize
            let to = from + Self.pageSize - 1
            
            let response: [Nightclub] = try await query
                .order("rating", ascending: false)
                .range(from: from, to: to)
                .execute()
                .value
            
            #if DEBUG
            print("✅ Fetched \(response.count) nightlife venues (page \(page))")
            #endif
            return response
        } catch {
            #if DEBUG
            print("❌ Error fetching nightclubs: \(error)")
            #endif
            throw NightclubServiceError.databaseError(error.localizedDescription)
        }
    }
    
    // Get nightclub by ID
    @MainActor
    func getNightclub(id: UUID) async throws -> Nightclub? {
        do {
            let response: [Nightclub] = try await supabase.database
                .from("nightclubs")
                .select()
                .eq("id", value: id.uuidString)
                .eq("is_active", value: true)
                .limit(1)
                .execute()
                .value
            
            return response.first
        } catch {
            #if DEBUG
            print("❌ Error fetching nightclub: \(error)")
            #endif
            throw NightclubServiceError.databaseError(error.localizedDescription)
        }
    }
}

// MARK: - Nightclub Filters

struct NightclubFilters {
    var venues: [String]?
    var music: [String]?
    var vibes: [String]?
    var priceLevels: [Int]?
    var entryTypes: [String]?
    
    var isEmpty: Bool {
        (venues == nil || venues?.isEmpty == true) &&
        (music == nil || music?.isEmpty == true) &&
        (vibes == nil || vibes?.isEmpty == true) &&
        (priceLevels == nil || priceLevels?.isEmpty == true) &&
        (entryTypes == nil || entryTypes?.isEmpty == true)
    }
}

